import '../../../styles/auth/authHeader.css'

export default function AuthHeader({title, subtitle}: {title: string, subtitle: string}) {
    return (
            <div className='auth-header-title'>
                <div className='auth-header-name'>{title}</div>
                <div className='auth-header-subtitle'>{subtitle}</div>
            </div>
    )
}