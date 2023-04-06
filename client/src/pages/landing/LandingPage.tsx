import Container from '../../components/container/container';
import './landingpage.scss';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import React, { useRef, useState } from "react";
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { show } from '../../util/toast-helper';

const LandingPage = () => {

    const [url, setUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const toast = useRef<Toast>(null);

    const validateUrl = (url: string) => {
        return url.length < 1 
            || url.length > 50 
            || !url.includes('http') 
            || !url.includes('.') 
            || url.includes(' ');
    };

    const onScanClicked = () => {
        if (loading) {
            setError('Please wait for the current scan to finish');
            show(toast, 'error', 'Scan in Progress', 'Please wait for the current scan to finish');
            return;
        }

        if (!validateUrl(url)) {
            setError('Please enter a valid URL');
            show(toast, 'error', 'Invalid URL', 'Please enter a valid URL');
            return;
        }

        setError(null);
        setLoading(true);

        show(toast, 'info', 'Analyzing Website', 'Please wait...');

        setTimeout(() => {
            setLoading(false);
            show(toast, 'success', 'Website Anaylized', 'Please wait...');
            setUrl('');
        }, 3000);
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
                        label={loading ? 'Analyzing...' : 'Analyze'} 
                        icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-search'} 
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