export interface IServices {
    createNews: (newsInfo: any) => Promise<any[]>;
}