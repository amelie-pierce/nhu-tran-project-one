export const getImgSizeWidth = (
    wMobile: number,
    wTablet: number,
    wDesktop: number,
    wTV: number
) => {
    const mobile = 480
    const tablet = 1024
    const desktop = 1500
    return `(max-width: ${mobile}px) ${wMobile}px, (max-width: ${tablet}px) ${wTablet}px, (max-width: ${desktop}px) ${wDesktop}px, ${wTV}px`
}
