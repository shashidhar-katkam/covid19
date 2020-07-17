import NewsService from '../Service';

export default class MyProfileService {
    private service: NewsService;

    constructor() {
        this.service = new NewsService();
    }

    public isAvailCheck(field: string, text: string, id: string): Promise<boolean> {
        return this.service.isAvailable({ field: field, text: text, id: id }).then((data: any) => {
            if (data.status) {
                if (data.data && data.data > 0) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }).catch(() => {
            return false;
        });
    }
}