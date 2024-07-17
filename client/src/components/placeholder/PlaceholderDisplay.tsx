import '../../styles/placeholder/placeholder.css'

export default function PlaceholderDisplay({ content }: { content: string }) {

    return (
        <div className='placeholder-container'>
            <div>{content}</div>
        </div>
    )
}