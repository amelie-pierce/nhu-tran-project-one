export const transformImage = (url: string, width = 500) => {
    return url
        .replace("/object/", "/render/image/")
        .concat(`?width=${width}&resize=contain&format=webp`)
}
