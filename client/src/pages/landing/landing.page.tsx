import Container from '../../components/container/container';
import './landing.scss';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import React, { useRef, useState } from "react";
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { ToastType, show } from '../../util/toast-helper';
import { LandingService } from './services/landing.service';
import { ERROR_MESSAGES } from './constants/landing-constants';

const LandingPage = () => {

    const [url, setUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const toast = useRef<Toast>(null);

    const showToastMessage = (type: ToastType, title: string, message: string) => {
        show(toast, type, title, message);
    };


    const analyzeWebsite = async () => {
        try {
            const errorFile = await LandingService.Instance.analyzeWebsite(url);
            LandingService.Instance.downloadFile(errorFile);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const onScanClicked = async () => {
        if (isLoading) {
            setError(ERROR_MESSAGES.SCAN_IN_PROGRESS);
            showToastMessage('error', 'Scan in Progress', ERROR_MESSAGES.SCAN_IN_PROGRESS);
            return;
        }

        if (LandingService.Instance.validateUrl(url)) {
            setError(ERROR_MESSAGES.INVALID_URL);
            showToastMessage('error', 'Invalid URL', ERROR_MESSAGES.INVALID_URL);
            return;
        }

        setError(null);
        setIsLoading(true);

        showToastMessage('info', 'Analyzing Website', 'Please wait...');

        const analysisSuccess = await analyzeWebsite();

        if (analysisSuccess) {
            showToastMessage('success', 'Website Analyzed', 'Please wait...');
            setUrl('');
        } else {
            setError(ERROR_MESSAGES.ANALYSIS_ERROR);
            showToastMessage('error', 'Error', ERROR_MESSAGES.ANALYSIS_ERROR);
        }

        setIsLoading(false);
    };

    const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value.trim());
    };

    return (
        <div className="landing__container">
            <Toast ref={toast} />
            <Container>
                <label className='landing__header' htmlFor="url">Website Analyzer</label>
                <div className='landing__main'>
                    <InputText
                        type='url'
                        value={url}
                        onChange={onUrlChange}
                        className={classNames({'p-invalid': error}, 'landing__main__input')}
                        id="url"
                        aria-describedby="url-help" 
                        placeholder='http://example.com' />

                    <Button 
                        onClick={onScanClicked}
                        label={isLoading ? 'Analyzing...' : 'Analyze'} 
                        icon={isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-search'} 
                        severity="warning" outlined />
                </div>
                <small id="url-help">
                    Enter your website to scan for contrast and speed.
                </small>
            </Container>
        </div>
    )

};

export default LandingPage;