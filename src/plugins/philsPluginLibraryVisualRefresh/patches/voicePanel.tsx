import { findComponentByCodeLazy } from "@webpack";
import ErrorBoundary from "@components/ErrorBoundary";
import { React } from "@webpack/common";

import { PanelButton } from "./userPanel";

export type { PanelButton };

const VoicePanelButton = findComponentByCodeLazy(".GREEN,positionKeyStemOverride:");

const voicePanelButtonsSubscriptions = new Set<React.DispatchWithoutAction>();
export const voicePanelButtons: PanelButton[] = new Proxy<PanelButton[]>([], {
    set: (target, p, newValue) => {
        target[p] = newValue;
        voicePanelButtonsSubscriptions.forEach(fn => fn());
        return true;
    },
});

export const useVoiceButtons = () => {
    const [, forceUpdate] = React.useReducer(() => ({}), {});

    React.useEffect(() => {
        voicePanelButtonsSubscriptions.add(forceUpdate);
        return () => void voicePanelButtonsSubscriptions.delete(forceUpdate);
    }, []);

    return voicePanelButtons;
};

function VoicePanelButtons({ props }: { props: { nameplate?: any; }; }) {
    const buttons = useVoiceButtons();
    if (!buttons.length) return null;

    return (
        <>
            {buttons.map(({ icon: Icon, tooltipText, onClick, name }) => (
                <VoicePanelButton
                    key={name}
                    tooltipText={tooltipText}
                    icon={Icon}
                    role="button"
                    plated={props?.nameplate != null}
                    onClick={onClick}
                />
            ))}
        </>
    );
}

export function renderVoicePanelButtons(props: { nameplate?: any; }) {
    return (
        <ErrorBoundary noop>
            <VoicePanelButtons props={props} />
        </ErrorBoundary>
    );
}

export function addVoicePanelButton(button: PanelButton) {
    voicePanelButtons.push(button);
}

export function removeVoicePanelButton(name: string) {
    voicePanelButtons.splice(
        0,
        voicePanelButtons.length,
        ...voicePanelButtons.filter(b => b.name !== name)
    );
}
