import { ApiService } from "../../../services/Api.service";
import { Nullable } from "../../../util/types";
import { IAnalyzeResponse } from "../interfaces/IAnalyzeResponse";

export class LandingService {

    public apiService = ApiService.Instance;
    public static instance: Nullable<LandingService> = null;

    private constructor() { }

    public static get Instance(): LandingService {
        if (!LandingService.instance) {
            LandingService.instance = new LandingService();
        }
        return LandingService.instance;
    }

    public async analyzeWebsite(url: string): Promise<any> {
        const fileUrl = await this.apiService.post<IAnalyzeResponse>('analyze', {
            body: {
                url
            }
        });

        return fileUrl.filePath;
    }

    public validateUrl = (url: string) => {
        return url.length < 1
            || url.length > 50
            || !url.includes('http')
            || !url.includes('.')
            || url.includes(' ');
    };

    public downloadFile = (fileUrl: string) => URL.revokeObjectURL(fileUrl);

}