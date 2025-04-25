declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
    pdf: any;
  }

  function pdfParse(buffer: Buffer, options?: any): Promise<PDFData>;
  
  export = pdfParse;
}