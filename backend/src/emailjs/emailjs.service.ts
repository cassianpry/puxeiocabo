import { Injectable, Logger } from '@nestjs/common';
import emailjs from '@emailjs/nodejs';

function wrapHtml(body: string) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#0a0a12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif">
  <table align="center" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;margin:48px auto">
    <tr>
      <td style="padding:0 0 16px 0">
        <h1 style="font-family:'Archivo Black',sans-serif;font-size:22px;text-transform:uppercase;letter-spacing:0.02em;color:#e0e0ff;margin:0">Puxei o Cabo</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color:#14141f;border-radius:8px;border-top:2px solid #3b82f6;padding:32px">
        ${body}
      </td>
    </tr>
    <tr>
      <td style="padding:24px 0 0 0">
        <hr style="border:none;border-top:1px solid #1e1e2e;margin:0 0 16px 0">
        <p style="color:#475569;font-size:12px;text-align:center;margin:0">
          Puxei o Cabo &mdash; den&uacute;ncias de rage quit no Street Fighter 6
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buttonHtml(url: string, label: string) {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td style="background-color:#3b82f6;border-radius:6px;padding:0"><a href="${url}" target="_blank" style="display:inline-block;padding:14px 36px;color:#0a0a12;text-decoration:none;font-size:15px;font-weight:600;border-radius:6px">${label}</a></td></tr></table>`;
}

@Injectable()
export class EmailJsService {
  private readonly logger = new Logger(EmailJsService.name);

  private get config() {
    return {
      publicKey: process.env.EMAILJS_PUBLIC_KEY || '',
      privateKey: process.env.EMAILJS_PRIVATE_KEY || '',
    };
  }

  private get serviceId() {
    return process.env.EMAILJS_SERVICE_ID || '';
  }

  private async send(templateId: string, params: Record<string, unknown>) {
    if (!this.config.publicKey || !this.serviceId || !templateId) {
      this.logger.warn('EmailJS not configured — skipping email');
      return;
    }

    await emailjs.send(this.serviceId, templateId, params, {
      publicKey: this.config.publicKey,
      privateKey: this.config.privateKey || undefined,
    });
  }

  async sendPasswordReset(email: string, token: string) {
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    const html = wrapHtml(`
      <h2 style="font-family:'Archivo Black',sans-serif;font-size:18px;text-transform:uppercase;letter-spacing:0.02em;color:#e0e0ff;margin:0 0 16px 0">Redefini&ccedil;&atilde;o de senha</h2>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 8px 0">Recebemos uma solicita&ccedil;&atilde;o para redefinir a senha da conta <strong style="color:#e0e0ff">${email}</strong>.</p>
      ${buttonHtml(resetUrl, 'Redefinir senha')}
      <p style="color:#64748b;font-size:13px;line-height:1.5;margin:16px 0 0 0">Este link expira em <strong style="color:#94a3b8">1 hora</strong>. Se voc&ecirc; n&atilde;o solicitou, ignore este email.</p>
    `);
    await this.send(process.env.EMAILJS_TEMPLATE_GENERIC || '', { to_email: email, subject: 'Redefinição de senha — Puxei o Cabo', html });
    this.logger.log(`Password reset email sent to ${email}`);
  }

  async sendEmailChangeVerification(email: string, token: string) {
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    const verifyUrl = `${appUrl}/auth/verify-email?token=${token}`;
    const html = wrapHtml(`
      <h2 style="font-family:'Archivo Black',sans-serif;font-size:18px;text-transform:uppercase;letter-spacing:0.02em;color:#e0e0ff;margin:0 0 16px 0">Confirme seu novo e-mail</h2>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 8px 0">Recebemos uma solicita&ccedil;&atilde;o para alterar o e-mail da sua conta para <strong style="color:#e0e0ff">${email}</strong>.</p>
      ${buttonHtml(verifyUrl, 'Confirmar e-mail')}
      <p style="color:#64748b;font-size:13px;line-height:1.5;margin:16px 0 0 0">Este link expira em <strong style="color:#94a3b8">1 hora</strong>. Se voc&ecirc; n&atilde;o solicitou, ignore este email.</p>
    `);
    await this.send(process.env.EMAILJS_TEMPLATE_GENERIC || '', { to_email: email, subject: 'Confirme seu novo e-mail — Puxei o Cabo', html });
    this.logger.log(`Email change verification sent to ${email}`);
  }

  async sendEmailVerification(email: string, token: string) {
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    const verifyUrl = `${appUrl}/auth/verify-email?token=${token}`;
    const html = wrapHtml(`
      <h2 style="font-family:'Archivo Black',sans-serif;font-size:18px;text-transform:uppercase;letter-spacing:0.02em;color:#e0e0ff;margin:0 0 16px 0">Confirme seu e-mail</h2>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 8px 0">Obrigado por criar sua conta no <strong style="color:#e0e0ff">Puxei o Cabo</strong>!</p>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 8px 0">Clique no bot&atilde;o abaixo para confirmar seu e-mail <strong style="color:#e0e0ff">${email}</strong> e ativar sua conta.</p>
      ${buttonHtml(verifyUrl, 'Confirmar e-mail')}
      <p style="color:#64748b;font-size:13px;line-height:1.5;margin:16px 0 0 0">Este link expira em <strong style="color:#94a3b8">1 hora</strong>. Se voc&ecirc; n&atilde;o criou esta conta, ignore este email.</p>
    `);
    await this.send(process.env.EMAILJS_TEMPLATE_GENERIC || '', { to_email: email, subject: 'Confirme seu e-mail — Puxei o Cabo', html });
    this.logger.log(`Verification email sent to ${email}`);
  }

  async sendAdminContactNotification(data: { name: string; email: string; subject: string; message: string }) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      this.logger.warn('ADMIN_EMAIL not set — skipping admin notification');
      return;
    }
    const html = wrapHtml(`
      <h2 style="font-family:'Archivo Black',sans-serif;font-size:18px;text-transform:uppercase;letter-spacing:0.02em;color:#e0e0ff;margin:0 0 16px 0">Novo contato</h2>
      <p style="color:#e0e0ff;font-size:14px;margin:0 0 4px 0"><strong>Nome:</strong> <span style="color:#94a3b8">${data.name}</span></p>
      <p style="color:#e0e0ff;font-size:14px;margin:0 0 4px 0"><strong>E-mail:</strong> <span style="color:#94a3b8">${data.email}</span></p>
      <p style="color:#e0e0ff;font-size:14px;margin:0 0 4px 0"><strong>Assunto:</strong> <span style="color:#94a3b8">${data.subject}</span></p>
      <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:16px 0 0 0;padding:12px;background:#0a0a12;border-radius:6px;white-space:pre-wrap">${data.message}</p>
    `);
    await this.send(process.env.EMAILJS_TEMPLATE_GENERIC || '', { to_email: adminEmail, subject: `[Contato] ${data.subject} — Puxei o Cabo`, html });
    this.logger.log(`Admin contact notification sent`);
  }
}
