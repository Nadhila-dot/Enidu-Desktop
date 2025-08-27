(function () {
  // Only run after DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    if (params.get('createdAssets') === 'true') {
      showAssetsCreatedModal();
    }
  });

  function showAssetsCreatedModal() {
    // Modal styles
    const style = document.createElement('style');
    style.textContent = `
      .enidu-modal-backdrop {
        position: fixed; z-index: 9999; inset: 0;
        background: rgba(0,0,0,0.35);
        display: flex; align-items: center; justify-content: center;
      }
      .enidu-modal {
        background: #fff; border-radius: 8px; box-shadow: 0 8px 32px #0002;
        padding: 32px 24px 24px 24px; max-width: 350px; width: 90%;
        text-align: center; position: relative;
        font-family: monospace;
      }
      .enidu-modal svg {
        width: 48px; height: 48px; margin-bottom: 12px; color: #222;
      }
      .enidu-modal h2 { margin: 0 0 8px 0; font-size: 1.3em; }
      .enidu-modal p { margin: 0 0 16px 0; color: #444; }
      .enidu-modal button {
        background: #000; color: #fff; border: none; border-radius: 4px;
        padding: 8px 20px; font-size: 1em; cursor: pointer;
      }
      .enidu-modal button:hover { background: #222; }
    `;
    document.head.appendChild(style);

    // Modal HTML
    const modal = document.createElement('div');
    modal.className = 'enidu-modal-backdrop';
    modal.innerHTML = `
      <div class="enidu-modal">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-open" viewBox="0 0 24 24"><path d="M3 19V5a2 2 0 0 1 2-2h3.17a2 2 0 0 1 1.41.59l2.83 2.83A2 2 0 0 0 13.83 7H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-5.17a2 2 0 0 1-1.41-.59l-2.83-2.83A2 2 0 0 0 8.17 3H5a2 2 0 0 0-2 2v14Z"/></svg>
        <h2>Assets Folder Created</h2>
        <p>
          The <b>enidu-assets</b> folder was created.<br>
          You can now edit <b>index.html</b> located in the enidu-assests to see live changes.
        </p>
        <button id="enidu-modal-close">OK</button>
      </div>
    `;
    document.body.appendChild(modal);

    // Close on button click or backdrop click
    modal.querySelector('#enidu-modal-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  }
})();