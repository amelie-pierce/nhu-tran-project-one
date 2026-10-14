import { Outlet } from "react-router"
import { Header, Footer } from "@/components"
import { useFeatureFlags } from "@/hooks/useFeatureFlags"
import GamePromoBanner from "@/components/GameBanner/GameBanner"
import styles from "./MainLayout.module.css"

const MainLayout = () => {
    const { isGameplayEnabled } = useFeatureFlags()

    return (
        <div className={styles.layout}>
            <Header />

            <main className={styles.main}>
                <Outlet />
            </main>

            <Footer />

            {isGameplayEnabled && <GamePromoBanner />}
        </div>
    )
}

export default MainLayout
