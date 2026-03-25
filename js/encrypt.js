document.addEventListener("DOMContentLoaded", () => {
  const blocks = document.querySelectorAll(".encrypted-block");

  blocks.forEach(block => {
    const btn = block.querySelector(".decrypt-btn");
    const passInput = block.querySelector(".enc-pass");
    const cipherText = block.querySelector(".cipher-text");
    const plainText = block.querySelector(".plain-text");

    if (!btn || !passInput || !cipherText || !plainText) {
      console.error("encrypted-block 缺少必要元素");
      return;
    }

    btn.addEventListener("click", async () => {
      try {
        const password = passInput.value;
        if (!password) {
          alert("请输入密码");
          return;
        }

        const jsonText = cipherText.textContent.trim();
        if (!jsonText) {
          alert("密文为空");
          return;
        }

        const obj = JSON.parse(jsonText);
        const { salt, iv, data } = obj;

        const encData = Uint8Array.from(atob(data), c => c.charCodeAt(0));
        const ivArr = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
        const saltArr = Uint8Array.from(atob(salt), c => c.charCodeAt(0));

        const pwKey = await crypto.subtle.importKey(
          "raw",
          new TextEncoder().encode(password),
          "PBKDF2",
          false,
          ["deriveKey"]
        );

        const aesKey = await crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt: saltArr,
            iterations: 100000,
            hash: "SHA-256"
          },
          pwKey,
          {
            name: "AES-GCM",
            length: 256
          },
          false,
          ["decrypt"]
        );

        const plainBuffer = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv: ivArr },
          aesKey,
          encData
        );

        const text = new TextDecoder().decode(plainBuffer);

        plainText.style.display = "block";
        plainText.innerHTML = text;
        passInput.style.display = "none";
        btn.style.display = "none";
        block.classList.add("decrypted");
      } catch (e) {
        alert("密码不对哈。");
        console.error(e);
      }
    });
  });
});
