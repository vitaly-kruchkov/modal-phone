import styles from './modal-phone.css';

interface ModalState {
  phone: string;
  mode: 'input' | 'success';
}

interface DOMElements {
  wrapper: HTMLDialogElement;
  modal: HTMLDivElement;
  input?: HTMLInputElement;
}

export class ModalPhone extends HTMLElement {
  private readonly shadow: ShadowRoot;
  private readonly elements: DOMElements;
  private state: ModalState = {
    phone: '',
    mode: 'input'
  };
  private onResolve?: (phone: string) => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    
    const style = document.createElement('style');
    style.textContent = styles;
    this.shadow.appendChild(style);

    const wrapper = document.createElement('dialog');
    wrapper.className = 'overlay';
    const modal = document.createElement('div');
    modal.className = 'modal';
    wrapper.appendChild(modal);
    this.shadow.appendChild(wrapper);

    this.elements = { wrapper, modal };

    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);

    modal.addEventListener('click', e => e.stopPropagation());
    
    this.render();
  }

  private updateState(newState: Partial<ModalState>) {
    const prevState = this.state;
    this.state = { ...this.state, ...newState };
    
    if (prevState.mode !== this.state.mode) {
      this.render();
    }
  }

  private close() {
    this.elements.wrapper.close();
    this.updateState({ phone: '', mode: 'input' });
  }

  private handleClose() {
    this.onResolve?.(this.state.phone);
    this.close();
  }

  private validatePhone(phone: string): boolean {
    return /^\+?\d{10,}$/.test(phone.replace(/\D/g, ''));
  }

  private handleSave() {
    const input = this.elements.input;
    if (!input) return;
    
    const phone = input.value.trim();
    if (!phone) {
      input.classList.add('error');
      return;
    }

    if (!this.validatePhone(phone)) {
      input.classList.add('error');
      alert('Пожалуйста, введите корректный номер телефона');
      return;
    }

    this.updateState({ phone, mode: 'success' });
    localStorage.setItem('phone-number', phone);
  }

  private render() {
    const { modal } = this.elements;
    modal.innerHTML = '';

    const closeButton = document.createElement('button');
    closeButton.id = 'close';
    closeButton.innerHTML = '&#10006;';
    closeButton.addEventListener('click', this.handleClose);
    modal.appendChild(closeButton);

    if (this.state.mode === 'input') {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Введите телефон';
      input.className = 'input';
      input.addEventListener('input', () => input.classList.remove('error'));
      
      const saveButton = document.createElement('button');
      saveButton.id = 'save';
      saveButton.textContent = 'Сохранить';
      saveButton.addEventListener('click', this.handleSave);

      modal.appendChild(input);
      modal.appendChild(saveButton);

      this.elements.input = input;
    } else {
      const successMessage = document.createElement('p');
      successMessage.textContent = `Успех ${this.state.phone}`;
      modal.appendChild(successMessage);
      
      delete this.elements.input;
    }
  }

  public open(): Promise<string> {
    this.updateState({ mode: 'input' });
    this.elements.wrapper.showModal();
  
    requestAnimationFrame(() => {
      this.elements.input?.focus();
    });
  
    return new Promise((resolve) => {
      this.onResolve = resolve;
    });
  }
}