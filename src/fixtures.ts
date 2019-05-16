export const respuestaErrorBanxico = {
    edoPet: -4,
};

export const validarCuentaBeneficiariaRequest = {
    numeroCuenta: 0,
    tipoCuenta: 10,
    claveSPEI: 0,
    hmac: "string",
    dispositivoSolicitante: {
      numeroCelular: 0,
      digitoVerificador: 0,
    },
  };

export const validarCuentaBeneficiariaRequestBanxico = {
    cb: 0,
    tc: 10,
    ci: 0,
    hmac: "string",
    ds: {         // Dispositivo solicitante
        nc : 0,
        dv : 0,
    },
};
