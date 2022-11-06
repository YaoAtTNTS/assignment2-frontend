export interface IPageData {
    count: number
    previous: string
    next: string
    results: IInvoiceData[]
}

export interface IInvoiceData {
    id: number
    invoiceNo: string;
    stockCode: string;
    description: string;
    quantity: number;
    invoiceDate: string;
    unitPrice: number;
    customerId: string;
    country: string;
}

export interface IProgressResponse {
    result: number
}

