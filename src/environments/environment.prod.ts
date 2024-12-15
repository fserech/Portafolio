declare const process: any;

export const environment = {
    production: true,
    gtmId: '',
    apiUrl: 'https://your-api-url.com',
    emailJs: {
        publicKey: process.env['EMAILJS_PUBLIC_KEY'] || '',
        serviceId: process.env['EMAILJS_SERVICE_ID'] || '',
        templateId: process.env['EMAILJS_TEMPLATE_ID'] || ''
    }
};