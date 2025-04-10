import React, { useState, useRef, useEffect } from "react";
import "./styles.css";

interface TextEllipsisProps {
  content: string;
  rows?: number;
  expandText?: string;
  collapseText?: string;
  dot?: string;
  html?: boolean; // 是否将content解析为HTML
  children?: React.ReactNode | ((props: { isExpand: boolean }) => React.ReactNode);
}

const TextEllipsis: React.FC<TextEllipsisProps> = ({
  content = "",
  rows = 5,
  expandText = "展开",
  collapseText = "收起",
  dot = "...",
  html = false,
  children,
}) => {
  const [text, setText] = useState(""); // 显示的文本内容
  const [isEll, setIsEll] = useState(false); // 是否省略
  const [isExpand, setIsExpand] = useState(false); // 是否展开

  const boxElRef = useRef<HTMLDivElement>(null); // 容器dom
  const actionElRef = useRef<HTMLSpanElement>(null); // 操作按钮容器dom

  // 计算显示的内容
  const textVisible = isExpand ? content : text;

  // 操作按钮文本
  const actionText = isExpand ? collapseText : expandText;

  // 将值转换为数字
  const toNum = (val: string): number => {
    if (!val) return 0;
    return parseFloat(val);
  };

  // 计算显示的内容
  const calcContent = () => {
    // 如果内容为空，直接返回
    if (!content || content.length === 0) {
      setText("");
      setIsEll(false);
      return;
    }

    // 初始化时直接显示全部内容，防止空白
    setText(content);

    // 等待DOM渲染完成再计算
    setTimeout(() => {
      if (!boxElRef.current) return;

      // 用新的div模拟文本内的容器环境
      const cloneBox = () => {
        if (!boxElRef.current) return;

        const originStyle = window.getComputedStyle(boxElRef.current);
        const div = document.createElement("div");
        const styleNames: string[] = Array.prototype.slice.call(originStyle);

        styleNames.forEach((name) => {
          div.style.setProperty(name, originStyle.getPropertyValue(name));
        });

        div.style.position = "fixed";
        div.style.zIndex = "-9999";
        div.style.top = "-9999px";
        div.style.height = "auto";
        div.style.minHeight = "auto";
        div.style.maxHeight = "auto";
        div.style.width = boxElRef.current.offsetWidth + "px";

        // 根据是否为HTML内容设置内容
        if (html) {
          div.innerHTML = content;
        } else {
          div.textContent = content;
        }

        document.body.appendChild(div);
        return div;
      };

      // 计算省略的文本内容
      const calcEllText = (div: HTMLElement, maxHeight: number) => {
        // 创建一个模拟的按钮元素
        const oEl = document.createElement("span");
        oEl.textContent = dot + expandText;
        oEl.style.display = "inline-block";
        oEl.style.whiteSpace = "nowrap";

        if (html) {
          // HTML内容需要特殊处理
          // 使用正则表达式匹配标签
          const tagRegex = /<[^>]+>/g;
          const htmlWithoutTags = content.replace(tagRegex, "");

          // 存储标签位置信息
          const tagPositions: { index: number; tag: string; isSelfClosing: boolean }[] = [];
          let match;
          const tempRegex = /<[^>]+>/g;

          while ((match = tempRegex.exec(content)) !== null) {
            // 检查是否是自闭合标签 (如 <br/>, <img/>, <hr/>)
            const isSelfClosing = /\/>$/.test(match[0]) || 
                                 /^<(br|hr|img|input|link|meta|area|base|col|embed|keygen|param|source|track|wbr)(\s|>)/i.test(match[0]);
            
            tagPositions.push({
              index: match.index,
              tag: match[0],
              isSelfClosing
            });
          }

          // 二分法计算省略时的文本
          let l = 0;
          let r = htmlWithoutTags.length;
          let res = -1;

          while (l <= r) {
            const mid = Math.floor((l + r) / 2);

            // 重建带标签的HTML
            let currentText = "";
            let plainTextIndex = 0;
            let htmlIndex = 0;

            while (plainTextIndex < mid && htmlIndex < content.length) {
              // 检查当前位置是否有标签
              const tagPosition = tagPositions.find((tp) => tp.index === htmlIndex);

              if (tagPosition) {
                // 如果有标签，添加标签并移动索引
                currentText += tagPosition.tag;
                htmlIndex += tagPosition.tag.length;
              } else {
                // 如果没有标签，添加字符并移动索引
                currentText += content[htmlIndex];
                htmlIndex++;
                plainTextIndex++;
              }
            }

            // 添加所有未闭合的标签
            const openTags = [];
            // 修改正则表达式以排除自闭合标签
            const tagRegex = /<([a-zA-Z][a-zA-Z0-9]*)(?![^>]*\/>)[^>]*>/g;
            const closingTagRegex = /<\/([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;

            let tagMatch;
            while ((tagMatch = tagRegex.exec(currentText)) !== null) {
              const tagName = tagMatch[1].toLowerCase();
              // 排除自闭合标签
              if (!['br', 'hr', 'img', 'input', 'link', 'meta', 'area', 'base', 'col', 'embed', 'keygen', 'param', 'source', 'track', 'wbr'].includes(tagName)) {
                openTags.push(tagName);
              }
            }

            while ((tagMatch = closingTagRegex.exec(currentText)) !== null) {
              const tagName = tagMatch[1].toLowerCase();
              const index = openTags.lastIndexOf(tagName);
              if (index !== -1) {
                openTags.splice(index, 1);
              }
            }

            // 添加未闭合标签的关闭标签
            for (let i = openTags.length - 1; i >= 0; i--) {
              currentText += `</${openTags[i]}>`;
            }

            div.innerHTML = currentText;
            div.appendChild(oEl.cloneNode(true));

            if (div.offsetHeight <= maxHeight) {
              // 未溢出
              l = mid + 1;
              res = mid; // 记录满足条件的值
            } else {
              // 溢出
              r = mid - 1;
            }
          }

          // 重建最终的HTML内容
          let finalHtml = "";
          let plainTextIndex = 0;
          let htmlIndex = 0;

          while (plainTextIndex < res && htmlIndex < content.length) {
            // 检查当前位置是否有标签
            const tagPosition = tagPositions.find((tp) => tp.index === htmlIndex);

            if (tagPosition) {
              // 如果有标签，添加标签并移动索引
              finalHtml += tagPosition.tag;
              htmlIndex += tagPosition.tag.length;
            } else {
              // 如果没有标签，添加字符并移动索引
              finalHtml += content[htmlIndex];
              htmlIndex++;
              plainTextIndex++;
            }
          }

          // 添加所有未闭合的标签
          const openTags = [];
          // 修改正则表达式以排除自闭合标签
          const tagRegex2 = /<([a-zA-Z][a-zA-Z0-9]*)(?![^>]*\/>)[^>]*>/g;
          const closingTagRegex2 = /<\/([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;

          let tagMatch2;
          while ((tagMatch2 = tagRegex2.exec(finalHtml)) !== null) {
            const tagName = tagMatch2[1].toLowerCase();
            // 排除自闭合标签
            if (!['br', 'hr', 'img', 'input', 'link', 'meta', 'area', 'base', 'col', 'embed', 'keygen', 'param', 'source', 'track', 'wbr'].includes(tagName)) {
              openTags.push(tagName);
            }
          }

          while ((tagMatch2 = closingTagRegex2.exec(finalHtml)) !== null) {
            const tagName = tagMatch2[1].toLowerCase();
            const index = openTags.lastIndexOf(tagName);
            if (index !== -1) {
              openTags.splice(index, 1);
            }
          }
          // 添加未闭合标签的关闭标签
          for (let i = openTags.length - 1; i >= 0; i--) {
            finalHtml += `</${openTags[i]}>`;
          }
          return finalHtml;
        } else {
          // 纯文本内容处理
          // 二分法计算省略时的文本
          let l = 0;
          let r = content.length;
          let res = -1;

          while (l <= r) {
            const mid = Math.floor((l + r) / 2);
            div.textContent = content.slice(0, mid);
            div.appendChild(oEl.cloneNode(true));

            if (div.offsetHeight <= maxHeight) {
              // 未溢出
              l = mid + 1;
              res = mid; // 记录满足条件的值
            } else {
              // 溢出
              r = mid - 1;
            }
          }
          return content.slice(0, Math.max(0, res));
        }
      };

      const div = cloneBox();
      if (!div) return;

      const lineHeight = toNum(window.getComputedStyle(div).lineHeight) || 24; // 默认行高24px
      const maxHeight = (rows + 0.5) * lineHeight;

      if (maxHeight < div.offsetHeight) {
        const ellText = calcEllText(div, maxHeight);
        setText(ellText);
        setIsEll(true);
      } else {
        setIsEll(false);
      }

      document.body.removeChild(div);
    }, 100); // 给更多时间让DOM渲染
  };

  // 展开/收起点击
  const onActionClick = () => {
    setIsExpand(!isExpand);
  };

  // 组件挂载后计算
  useEffect(() => {
    calcContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, rows, expandText, collapseText, dot]);

  // 渲染子元素
  const renderChildren = () => {
    if (typeof children === "function") {
      return children({ isExpand });
    }
    return children || actionText;
  };

  return (
    <div
      className="custom-text-ellipsis"
      ref={boxElRef}
    >
      {html ? (
        // 如果是HTML内容，使用dangerouslySetInnerHTML
        <span dangerouslySetInnerHTML={{ __html: textVisible }} />
      ) : (
        // 纯文本内容
        textVisible
      )}
      {isEll && (
        <span
          className="custom-text-ellipsis-suffix"
          ref={actionElRef}
        >
          {!isExpand && dot}
          <span
            className="custom-text-ellipsis-action"
            onClick={onActionClick}
          >
            {renderChildren()}
          </span>
        </span>
      )}
      {/* 样式已移动到组件外部 */}
    </div>
  );
};

export default TextEllipsis;
