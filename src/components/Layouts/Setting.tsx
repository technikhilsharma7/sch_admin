import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { toggleAnimation, toggleLayout, toggleMenu, toggleNavbar, toggleRTL, toggleTheme, toggleSemidark } from '../../store/themeConfigSlice';

const Setting = () => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    const [showCustomizer, setShowCustomizer] = useState(false);

    return (
        <div>
            <div className={`${(showCustomizer && '!block') || ''} fixed inset-0 bg-[black]/60 z-[51] px-4 hidden transition-[display]`} onClick={() => setShowCustomizer(false)}></div>

            
        </div>
    );
};

export default Setting;
