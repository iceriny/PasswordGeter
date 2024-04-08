/**
 * @type {{id: string, nickname: string}}
 */
let currentIdentity = null;
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
    const existingIdentityContainerElement =
        document.getElementById("existing-identity");
    if (!existingIdentityContainerElement)
        throw new Error("identityContainerElement is null");

    identityCount++;

    const identityEl = document.createElement("div");
    identityEl.classList.add("identity-container");
    identityEl.innerText = identity.nickname;

    identityEl.setAttribute("id", "identity-" + identityCount);
    identityEl.setAttribute("identity-id", identity.id);
    identityEl.setAttribute("nickname", identity.nickname);

    identityEl.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        displayIdentityContextMenu(e);
    });
    var pressTimer;

    // 监听 touchstart 事件
    identityEl.addEventListener("touchstart", function (e) {
        // 阻止默认的触摸事件
        e.preventDefault();

        // 开始计时，延时 500ms 后触发长按事件
        pressTimer = setTimeout(function () {
            // 在这里触发长按事件
            displayIdentityContextMenu(e);
        }, 500);
    });

    // 监听 touchmove 事件，如果手指移动，则取消计时
    identityEl.addEventListener("touchmove", function () {
        clearTimeout(pressTimer);
    });

    // 监听 touchend 事件，如果手指离开屏幕，则取消计时
    identityEl.addEventListener("touchend", function () {
        clearTimeout(pressTimer);
    });

    identityEl.addEventListener("click", (event) => {
        setCurrentIdentityFromElement(event.target);
        identityEl.remove();
    });

    return identityEl;
}
/**
 * 删除触发上下文菜单的身份
 * @param {Event} event 点击事件
 */
function delateIdentityClick(event) {
    const identityEl = document.getElementById(
        event.target.parentNode.getAttribute("current-element")
    );
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
    const identityContextMenuElement = document.getElementById(
        "identity-context-menu"
    );
    if (!identityContextMenuElement)
        throw new Error("identityContextMenuElement is null");

    const target = event.target;
    identityContextMenuElement.setAttribute(
        "current-element",
        target.getAttribute("id")
    );

    const targetRect = target.getBoundingClientRect();
    if (targetRect.right > window.innerWidth) {
        identityContextMenuElement.style.right = targetRect.right - 200 + "px";
    } else {
        identityContextMenuElement.style.right =
            parseInt(targetRect.right) - 150 + "px";
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
    const identityContextMenuElement = document.getElementById(
        "identity-context-menu"
    );
    if (!identityContextMenuElement)
        throw new Error("identityContextMenuElement is null");

    if (
        event.target === identityContextMenuElement ||
        identityContextMenuElement.contains(event.target)
    )
        return;
    identityContextMenuElement.style.display = "none";
}

/** ## 身份加载 */
function loadIdentity() {
    const oldIdentity = getIdentity();
    const existingIdentityContainerElement =
        document.getElementById("existing-identity");
    if (!existingIdentityContainerElement)
        throw new Error("identityContainerElement is null");

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
    buildFunctionPage();
}
/**
 * 
 * @param {{id:string, nickname: string}} identity 身份
 */
function setCurrentIdentityFromIdentity(identity) {
    currentIdentity = identity;
    buildFunctionPage();
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

    // var encryptedMessage = btoa(encodeURIComponent(midProduct));
    var encryptedMessage = LZString.compressToBase64(midProduct);;

    return encryptedMessage;
}

// 解密函数
function decrypt(encryptedMessage) {
    // var msg = decodeURIComponent(atob(encryptedMessage));
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
    const startTimeInput = document.getElementById(
        "limitTimeStart-input"
    )?.value;
    if (startTimeInput !== "") {
        // 解析时间字符串
        var parts = startTimeInput.split(":");
        var month = parseInt(parts[0]);
        var day = parseInt(parts[1]);
        var hour = parseInt(parts[2]);
        var minute = parseInt(parts[3]);

        // 获取当前日期和时间
        var currentDate = new Date();
        // 创建 当前 年份
        var currentYear = currentDate.getFullYear(); // 获取当前年份

        // 如果月份超过当前月份，表示时间点在明年
        if (month < currentDate.getMonth() + 1) {
            // 如果当前月份为12月，且目标月份为1月，则年份加1
            if (currentDate.getMonth() === 11 && month === 1) {
                currentYear++;
            }
        }

        var date = new Date(currentYear, month - 1, day, hour, minute); // 注意月份要减去 1
        startTime = date.getTime();
    } else {
        startTime = Date.now();
    }

    /** @type {string} */
    const limitTimeInput = document.getElementById("limitTime-input")?.value;
    if (!limitTimeInput) {
        alert("请输入时间范围。");
        return;
    }
    const limitHour = parseInt(limitTimeInput.split(":")[0]);
    const limitMinute = parseInt(limitTimeInput.split(":")[1]);

    const limit = limitHour * 60 * 60 * 1000 + limitMinute * 60 * 1000;
    const limitTime = startTime + limit;

    // VV 获取可选的加密内容 VV //
    const contentInput = document.getElementById("content-input")?.value;

    var unencrypted = {
        id: identityId,
        limitTime: limitTime,
        content: contentInput === "" ? "无" : contentInput,
    };

    const unencryptedString = JSON.stringify(unencrypted);

    const encrypted = encrypt(unencryptedString);
    copyToClipboard(encrypted);
    return encrypted;
}


function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('文本已成功复制到剪贴板');
      })
      .catch(err => {
        alert('复制到剪贴板失败:', err);
      });
  }



document.addEventListener("DOMContentLoaded", () => {
    buildInitiallyPage();
});

document.addEventListener("click", (event) => {
    hideIdentityContextMenu(event);
});

function buildInitiallyPage() {
    const variableContainer = document.getElementById("variable-container");
    if (!variableContainer) throw new Error("mainContainer is null");

    variableContainer.innerHTML = `
        <div class="input-container">
            <input type="number" id="BCID-input" placeholder="输入你BC的ID号" />
        </div>
        <div class="input-container">
            <input type="text" id="nickname-input" placeholder="昵称" />
        </div>

        <div class="button-container">
            <button id="button" onclick="identityGenerateClick()">初始化身份信息</button>
        </div>

        <div id="existing-identity" class="existing-identity">
        </div>
        `;
    loadIdentity();
}

function buildFunctionPage() {
    const variableContainer = document.getElementById("variable-container");
    if (!variableContainer) throw new Error("mainContainer is null");

    variableContainer.innerHTML = `
        <div class="input-container">
        <input type="test" id="limitTimeStart-input" placeholder="秘钥开始时间(月:日:时:分)留空为当前时间   e.g. 1:1:12:30  => 1月1日12时30分" />
        </div>
        <div class="input-container">
            <input type="text" id="limitTime-input" placeholder="秘钥有效期(时:分)    e.g. 1:30  => 一个半小时" />
        </div>

        <div class="input-container">
            <input type="text" id="content-input" placeholder="加密内容(可选)" />
        </div>

        <div class="button-container">
            <button id="button" onclick="getSecretKey()">获取秘钥</button>
        </div>
        `;
}
