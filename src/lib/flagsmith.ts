import flagsmith from "flagsmith"

export const initFlagsmith = () => {
    return flagsmith.init({
        environmentID: import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_KEY,
    })
}

export default flagsmith
