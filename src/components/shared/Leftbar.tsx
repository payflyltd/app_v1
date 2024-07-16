import { sidebarLinks } from '@/constants';
import { INavLink } from '@/types';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { useUser } from '@/context/UserContext';

const Leftbar = () => {
    const { user } = useUser();

    if (!user) {
        return <p>Loading...</p>;
    }

    const { pathname } = useLocation();

    return (
        <nav className="leftsidebar">
            <div className="flex flex-col gap-11">
                <Link to='/home' className='flex gap-3 items-center'>
                    <img src="/assets/images/logo.png" alt="logo" width={150} height={30} />
                </Link>
                {/* Profile picture */}
                <Link to='/profile' className='flex items-center gap-3'>
                    {user.profile_picture ? (
                        <img 
                            src={`https://blockchainbinaryopt.shop/payfly/backend/api/uploads/${user.profile_picture}`} 
                            alt="" 
                            width={50} 
                            height={50} 
                            style={{ borderRadius: '50%' }}
                        />
                    ) : (
                        <img src="/assets/images/profile.png" alt="" width={50} height={50} />
                    )}
                    <div className="flex flex-col">
                        <p className='body-bold'>{user.name}</p>
                        <p className='small-regular text-light-3'>@{user.username}</p>
                    </div>
                </Link>
                <ul className="flex flex-col gap-6">
                    {sidebarLinks.map((link: INavLink) => {
                        const isActive = pathname === link.route;
                        return (
                            <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                                <NavLink to={link.route} className='flex gap-4 items-center p-4'>
                                    <img src={link.imgURL} alt={link.label} className={`group-hover:invert-white ${isActive && 'invert-white'}`} />
                                    {link.label}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <Button variant="ghost" className='shad-button_ghost'>
                <img src="/assets/icons/logout.svg" alt="logout icon" />
                <p className='small-medium lg:base-medium'>Logout</p>
            </Button>
        </nav>
    );
};

export default Leftbar;
