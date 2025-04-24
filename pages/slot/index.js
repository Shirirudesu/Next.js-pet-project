import SlotMachine from '../../components/slot'

export default function SlotPage(props) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <SlotMachine credits={props.credits} setCredits={props.setCredits} />qs
    </div>
  )
}
