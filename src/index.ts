import { ModalPhone } from './ModalPhone';

let registered = false;
let modalInstance: ModalPhone | null = null;

export async function setPhone(): Promise<string> {
  return new Promise((resolve) => {
    if (!customElements.get('modal-phone')) {
      customElements.define('modal-phone', ModalPhone);
    }

    if (modalInstance) return;

    modalInstance = document.createElement('modal-phone') as ModalPhone;
    document.body.appendChild(modalInstance);

    modalInstance.open().then((phone) => {
      resolve(phone);
      modalInstance?.remove();
      modalInstance = null;
    });
  });
}