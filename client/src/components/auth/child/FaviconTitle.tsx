import '../../../styles/favicon/faviconTitle.css'

export default function FaviconTitle({title, subtitle}: {title: string, subtitle: string}) {
    return (
        <>
            <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@300&family=Barlow:ital@1&family=Fira+Sans:ital,wght@1,300&family=Gowun+Batang&family=Hind&display=swap');
            </style>
            <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@300&family=Barlow:ital@1&family=Fira+Sans:ital,wght@1,300&family=Gowun+Batang&family=Roboto+Flex&display=swap');
            </style>
            <div className='favicon-title'>
                <div className='favicon-title-name'>{title}</div>
                <div className='favicon-subtitle-name'>{subtitle}</div>
            </div>
        </>
    )
}