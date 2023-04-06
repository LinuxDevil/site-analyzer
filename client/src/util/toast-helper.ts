import { Toast } from "primereact/toast";
import { RefObject } from "react";

export const show = (toast: RefObject<Toast>, severity: "success" | "info" | "warn" | "error" | undefined = 'success', summary: string = 'Website Anaylized', detail: string = 'Please wait') => {
    toast.current && toast.current.show({ severity, summary, detail });
};
