import { validateReport } from './lib/validateReport'
import { report as rawReport } from './data/report'
import AmbientBackground from './components/AmbientBackground'
import SmoothScroll from './components/SmoothScroll'
import Hero from './components/sections/Hero'
import HeadlineFinding from './components/sections/HeadlineFinding'
import Explorer from './components/sections/Explorer'
import Carrier from './components/sections/Carrier'
import Pharmaco from './components/sections/Pharmaco'
import Negatives from './components/sections/Negatives'
import Action from './components/sections/Action'
import MethodologyFooter from './components/sections/MethodologyFooter'
import FindingDetailDrawer from './components/ui/FindingDetailDrawer'
import JumpNav from './components/ui/JumpNav'
import DisclaimerBar from './components/ui/DisclaimerBar'
import MotionToggle from './components/ui/MotionToggle'

// Validate at startup so a malformed report fails loudly rather than rendering
// half a page.
validateReport(rawReport)

function App() {
  return (
    <>
      <SmoothScroll />
      <AmbientBackground />
      <JumpNav />
      <MotionToggle />

      <main>
        <Hero />
        <HeadlineFinding />
        <Explorer />
        <Carrier />
        <Pharmaco />
        <Negatives />
        <Action />
        <MethodologyFooter />
      </main>

      <FindingDetailDrawer />
      <DisclaimerBar />
    </>
  )
}

export default App
