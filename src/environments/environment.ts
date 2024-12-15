declare const process: any;

export const environment = {
    production: false,
    gtmId: '',
    apiUrl: 'http://localhost:3000',
    emailJs: {
        publicKey: process.env['EMAILJS_PUBLIC_KEY'] || 'dmJ6QufZkwlNw4xIx',
        serviceId: process.env['EMAILJS_SERVICE_ID'] || 'service_qeij7yj',
        templateId: process.env['EMAILJS_TEMPLATE_ID'] || 'template_du2agy5'
    }
};