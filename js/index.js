/**
 * @type {{id: string, nickname: string}}
 */
let currentIdentity = null;
/**
 * @type {HTMLImageElement | null}
 */
let LogoImg = null;
/**
 * 身份生成函数
 * UI点击生成身份
 */
function identityGenerateClick() {
    const iDInputElement = document.getElementById("BCID-input");
    const nicknameInputElement = document.getElementById("nickname-input");

    if (iDInputElement && nicknameInputElement) {
        /** @type {string} */
        const iDInputValue = iDInputElement.value;
        /** @type {string} */
        const nicknameInputValue = nicknameInputElement.value;

        if (iDInputValue !== "" && nicknameInputValue !== "") {
            const identity = {
                id: iDInputValue,
                nickname: nicknameInputValue,
            };
            saveIdentity(identity);
            loadIdentity();
            setCurrentIdentityFromIdentity(identity);
            iDInputElement.value = null;
            nicknameInputElement.value = null;
            buildFunctionPage();
        }
    }
}

/**
 * ### 储存身份
 * @param {{id: string, nickname: string }} identity 储存的身份列表
 */
function saveIdentity(identity) {
    const oldIdentity = getIdentity();
    oldIdentity.push(identity);
    const identityString = JSON.stringify(oldIdentity);
    localStorage.setItem("identity", identityString);
}

/**
 * ### 获取身份
 * @returns {{id: string, nickname: string }[]} 获取到的身份列表
 */
function getIdentity() {
    // 假设从localStorage获取身份数据并进行解析
    const identityString = localStorage.getItem("identity");
    return identityString ? JSON.parse(identityString) : [];
}

/**
 * 删除目标身份
 * @param {{id: string, nickname: string }} identity 要删除的身份
 */
function deleteIdentity(identity) {
    const oldIdentity = getIdentity();
    const newIdentity = oldIdentity.filter((item) => item.id !== identity.id);
    const identityString = JSON.stringify(newIdentity);
    localStorage.setItem("identity", identityString);
}
/**
 * @type {number} 身份计数
 */
var identityCount = 0;

/**
 * 生成身份元素
 * @param {{id: string, nickname: string }} identity 身份
 */
function GenerateIdentityElement(identity) {
    const existingIdentityContainerElement = document.getElementById("existing-identity");
    if (!existingIdentityContainerElement) throw new Error("identityContainerElement is null");

    identityCount++;

    const identityEl = document.createElement("button");
    identityEl.classList.add("identity-container");
    identityEl.innerText = identity.nickname;

    identityEl.setAttribute("id", "identity-" + identityCount);
    identityEl.setAttribute("identity-id", identity.id);
    identityEl.setAttribute("nickname", identity.nickname);

    identityEl.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        displayIdentityContextMenu(e);
    });
    /**
     * 点击事件处理
     * @param {event} event 事件
     */
    function identityClick(event) {
        setCurrentIdentityFromElement(event.target);
        buildFunctionPage();
    }
    let pressTimer;
    let startTouchTime = 0;
    // 监听 touchstart 事件
    identityEl.addEventListener(
        "touchstart",
        function (e) {
            // 阻止默认的触摸事件
            e.preventDefault();

            startTouchTime = 0;
            startTouchTime = Date.now();
            // 开始计时，延时 500ms 后触发长按事件
            pressTimer = setTimeout(function () {
                // 在这里触发长按事件
                displayIdentityContextMenu(e);
            }, 500);
        },
        { passive: true }
    );

    // 监听 touchmove 事件，如果手指移动，则取消计时
    identityEl.addEventListener(
        "touchmove",
        function () {
            clearTimeout(pressTimer);
        },
        { passive: true }
    );

    // 监听 touchend 事件，如果手指离开屏幕，则取消计时
    identityEl.addEventListener("touchend", function (e) {
        clearTimeout(pressTimer);
        if (Date.now() - startTouchTime < 100) {
            // 触发点击事件
            identityClick(e);
        }
    });

    identityEl.addEventListener("click", (event) => {
        identityClick(event);
    });

    return identityEl;
}
/**
 * 删除触发上下文菜单的身份
 * @param {Event} event 点击事件
 */
function delateIdentityClick(event) {
    const identityEl = document.getElementById(event.target.parentNode.getAttribute("current-element"));
    const identity = {
        id: identityEl.getAttribute("identity-id"),
        nickname: identityEl.getAttribute("nickname"),
    };
    deleteIdentity(identity);
    identityEl.remove();

    hideIdentityContextMenu();
}
/**
 * 显示身份上下文菜单
 * @param {MouseEvent} event
 */
function displayIdentityContextMenu(event) {
    const identityContextMenuElement = document.getElementById("identity-context-menu");
    if (!identityContextMenuElement) throw new Error("identityContextMenuElement is null");

    const target = event.target;
    identityContextMenuElement.setAttribute("current-element", target.getAttribute("id"));

    const targetRect = target.getBoundingClientRect();
    if (targetRect.right > window.innerWidth) {
        identityContextMenuElement.style.right = targetRect.right - 200 + "px";
    } else {
        identityContextMenuElement.style.right = parseInt(targetRect.right) - 150 + "px";
    }
    identityContextMenuElement.style.top = parseInt(targetRect.top) - 20 + "px";

    identityContextMenuElement.style.left = "";
    identityContextMenuElement.style.display = "block";
}
/**
 * 隐藏身份上下文菜单
 * @param {Event} event 点击事件
 * @returns void
 */
function hideIdentityContextMenu(event) {
    const identityContextMenuElement = document.getElementById("identity-context-menu");
    if (!identityContextMenuElement) throw new Error("identityContextMenuElement is null");

    if (event && (event.target === identityContextMenuElement || identityContextMenuElement.contains(event.target)))
        return;
    identityContextMenuElement.style.display = "none";
}

/** ## 身份加载 */
function loadIdentity() {
    const oldIdentity = getIdentity();
    const existingIdentityContainerElement = document.getElementById("existing-identity");
    if (!existingIdentityContainerElement) throw new Error("identityContainerElement is null");

    oldIdentity.forEach((identity) => {
        const identityEl = GenerateIdentityElement(identity);
        existingIdentityContainerElement.appendChild(identityEl);
    });
}
/**
 *
 * @param {HTMLElement} element 身份
 */
function setCurrentIdentityFromElement(element) {
    const id = element.getAttribute("identity-id");
    const nickname = element.getAttribute("nickname");
    currentIdentity = { id, nickname };
}
/**
 *
 * @param {{id:string, nickname: string}} identity 身份
 */
function setCurrentIdentityFromIdentity(identity) {
    currentIdentity = identity;
}
/**
 *
 * @returns {number} 当前身份的ID
 */
function getCurrentIdentityID() {
    return currentIdentity ? parseInt(currentIdentity.id) : -1;
}

/**
 * @type {string} 用于加密的秘钥
 */
const KEY = "bbf19967-af5d-4e85-8f3a-98afd8bde7a7";

// 加密函数
function encrypt(message) {
    var midProduct = "";
    for (var i = 0; i < message.length; i++) {
        var charCode = (message.charCodeAt(i) + KEY.charCodeAt(i % KEY.length)) % 65536; // 支持 UTF-16 编码
        midProduct += String.fromCharCode(charCode);
    }

    var encryptedMessage = LZString.compressToBase64(midProduct);

    return encryptedMessage;
}

// 解密函数
function decrypt(encryptedMessage) {
    var msg = LZString.decompressFromBase64(encryptedMessage);

    var decryptedMessage = "";
    for (var i = 0; i < msg.length; i++) {
        var charCode = (msg.charCodeAt(i) - KEY.charCodeAt(i % KEY.length) + 65536) % 65536; // 支持 UTF-16 编码
        decryptedMessage += String.fromCharCode(charCode);
    }
    return decryptedMessage;
}

function getSecretKey() {
    // VV 获取身份ID VV //
    const identityId = getCurrentIdentityID();
    if (identityId === -1) {
        alert("当前身份的ID错误!!!");
        return;
    }
    // VV 获取秘钥有效期 VV //
    let startTime = 0;
    /** @type {string} */
    const startTimeInput = document.getElementById("limitTimeStart-input")?.value;
    if (startTimeInput !== "") {
        // 解析时间字符串
        const date = new Date(startTimeInput);
        startTime = date.getTime();
    } else {
        startTime = Date.now();
    }

    /** @type {string} */
    const limitTimeInput = document.getElementById("limitTime-input")?.value ?? "1:0";
    let limitTime = 0;

    if (limitTimeInput !== "") {
        const limitParts = limitTimeInput.split(":");
        if (limitParts.length !== 2) {
            alert("请输入正确的时间格式，如一个小时则为 => 1:0");
            return;
        }
        const limitHour = limitParts[0];
        const limitMinute = limitParts[1];

        limitTime = limitHour * 60 * 60 * 1000 + limitMinute * 60 * 1000;
    } else {
        limitTime = 60 * 60 * 1000;
    }

    // VV 获取可选的加密内容 VV //
    const contentInput = document.getElementById("content-input")?.value;

    var unencrypted = {
        id: identityId,
        startTime: startTime,
        limitTime: limitTime,
        content: contentInput === "" ? "无" : contentInput,
    };

    const unencryptedString = JSON.stringify(unencrypted);

    const encrypted = encrypt(unencryptedString);
    copyToClipboard(encrypted);
    return encrypted;
}

function copyToClipboard(text) {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            alert("文本已成功复制到剪贴板");
        })
        .catch((err) => {
            alert("复制到剪贴板失败:", err);
        });
}

// VV UI VV //

function resizeBody() {
    const body = document.body;
    const height = window.innerHeight;
    const width = window.innerWidth;

    body.style.height = height + "px";
    body.style.width = width + "px";
}

const currentHostName = window.location.hostname;
const pageHref = currentHostName === "iceriny.github.io" ? "https://iceriny.github.io/PasswordGeter/" : "../";
function buildInitiallyPage() {
    LogoImg.parentElement.classList.add("img-container-default");

    const variableContainer = document.getElementById("variable-container");
    if (!variableContainer) throw new Error("mainContainer is null");
    fetch(`${pageHref}/html/initially.html`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then((data) => {
            variableContainer.innerHTML = data;
            loadIdentity();
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
        });
}

function buildFunctionPage() {
    LogoImg.parentElement.classList.remove("img-container-default");
    const variableContainer = document.getElementById("variable-container");
    if (!variableContainer) throw new Error("mainContainer is null");

    fetch(`${pageHref}/html/function.html`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then((data) => {
            variableContainer.innerHTML = data;
            // setToolTipsElement();
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
        });
}
/**
 * @type {HTMLDivElement | undefined}
 */
let toolTips;
function setToolTipsElement() {
    toolTips = document.getElementById("tool-tips");
    toolTips.classList.add("hide");
}
function setLogoElement() {
    LogoImg = document.getElementById("logo");
    LogoImg.addEventListener("click", () => {
        buildInitiallyPage();
    });
}
/**
 * Input事件的焦点元素
 * @param {Event} event 触发焦点事件的Input元素
 */
function inputFocus(event) {
    const target = event.target;
    showTips(target);
    LogoImg.classList.add("logo-light");
    const label = getInputLabel(target);
    if (label) {
        label.classList.add("input-label-focus");
    }
}
function getInputLabel(inputElement) {
    const labelId = inputElement.getAttribute("label");
    const label = document.getElementById(labelId);
    return label;
}
/**
 * 输入框的提示信息
 * @type {Map<string, string>}
 */
const tipsMap = new Map([
    ["BCID-input", "<hr>请输入您在BC中的ID<br>此ID必须是你要赋予秘钥的目标的主人"],
    ["nickname-input", "<hr>请输入您的昵称<br>这是在浏览器中记忆的显示名称<br>可以是任意你想要的内容"],
    ["limitTimeStart-input", "<hr>请输入秘钥有效期的开始时间<br>留空则默认为当前时间"],
    ["limitTime-input", "<hr>请输入时间范围(时:分)<br>默认为一个小时<br>最长24小时"],
    ["content-input", "<hr>可选的加密内容<br>可以添加解密时的留言或其他任何信息"],
]);
Object.freeze(tipsMap);
/**
 * 显示Tips
 * @param {EventTarget | null} EventTarget 触发的tips事件
 */
function showTips(EventTarget) {
    if (!toolTips) throw new Error("tool-tips is null");

    toolTips.innerHTML = tipsMap.get(EventTarget.getAttribute("id") ?? Symbol()) ?? "提示丢失";

    const targetRect = EventTarget.getBoundingClientRect();
    toolTips.style.left = targetRect.left + targetRect.width + "px";
    toolTips.style.top = targetRect.top + "px";

    toolTips.classList.remove("hide");
    toolTips.classList.add("show");
}

/**
 * Input元素丢失焦点时触发
 * @param {Event} event 输入元素丢失焦点的事件
 */
function inputBlur(event) {
    hideToolTips();
    LogoImg.classList.remove("logo-light");
    const label = getInputLabel(event.target);
    if (label) {
        label.classList.remove("input-label-focus");
    }
}
/**
 * 隐藏提示框
 */
function hideToolTips() {
    if (!toolTips) throw new Error("tool-tips is null");

    toolTips.classList.remove("show");
    toolTips.classList.add("hide");
}

document.addEventListener("DOMContentLoaded", () => {
    setLogoElement();
    setToolTipsElement();

    buildInitiallyPage();
});

document.addEventListener("click", (event) => {
    hideIdentityContextMenu(event);
});

window.addEventListener("resize", () => {
    hideIdentityContextMenu();
    hideToolTips();
    resizeBody();
});

document.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
        hideIdentityContextMenu(event);
    }
    if (event.key === "Enter") {
        const buttonContainer = document.getElementById("button-container");
        const button = buttonContainer.querySelector("button");
        if (button) {
            button.click();
        }
    }
});
