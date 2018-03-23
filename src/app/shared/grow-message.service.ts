import {Injectable} from '@angular/core';
import {MessageService} from 'primeng/components/common/messageservice';

@Injectable()
export class GrowMessageService {
  private SUCCESS = 'success';
  private INFO = 'info';
  private WARN = 'warn';
  private ERROR = 'error';

  constructor(private messageService: MessageService) {
  }

  addSingleError(summary: string, detail: string) {
    this.addSingle(this.ERROR, summary, detail);
  }

  addSingleWarn(summary: string, detail: string) {
    this.addSingle(this.WARN, summary, detail);
  }

  addSingleInfo(summary: string, detail: string) {
    this.addSingle(this.INFO, summary, detail);
  }

  addSingleSuccess(summary: string, detail: string) {
    this.addSingle(this.SUCCESS, summary, detail);
  }

  addSucesso(detail: string) {
    this.addSingleSuccess('Sucesso', detail);
  }

  addErro(detail: string) {
    this.addSingleError('Mensagem de Erro', detail);
  }


  private addSingle(severity: string, summary: string, detail: string) {
    this.messageService.add({severity: severity, summary: summary, detail: detail});
  }

  addMultiple(growMessages: Array<GrowMessage>) {
    this.messageService.addAll(growMessages);
  }

  clear() {
    this.messageService.clear();
  }
}

export class GrowMessage {
  constructor(severity: string, summary: string, detail: string) {
  }
}
