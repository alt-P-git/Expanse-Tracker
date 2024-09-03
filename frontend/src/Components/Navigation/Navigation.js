import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import avatar from '../../img/avatar.png';
import { signout } from '../../utils/Icons';
import { menuItems } from '../../utils/menuItems';

const apiUrl = "http://localhost:4000";

const useUserData = () => {
    const [userdata, setUserdata] = useState({});
    console.log("response", userdata);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch(`${apiUrl}/login/success`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setUserdata(data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getUser();
    }, []);

    return userdata;
};

function Navigation({ active, setActive }) {
    const userdata = useUserData();

    const loginwithgoogle = () => {
        window.open(`${apiUrl}/auth/google/callback`, "_self");
    };

    const logout = () => {
        window.open(`${apiUrl}/logout`, "_self");
    };

    const handleMenuClick = (itemId) => {
        if (Object.keys(userdata).length === 0) {
            alert("Please log in to continue");
        } else {
            setActive(itemId);
        }
    };

    return (
        <NavStyled>
            <div className="user-con">
                <img src={userdata.image ? userdata.image : avatar} alt="User Avatar" />
                <div className="text">
                    <h2>{userdata.displayName || 'Guest'}</h2>
                    <p>Expense Manager</p>
                </div>
            </div>
            <ul className="menu-items">
                {menuItems.map((item) => {
                    return (
                        <li
                            key={item.id}
                            onClick={() => handleMenuClick(item.id)}
                            className={active === item.id ? 'active' : ''}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                        </li>
                    );
                })}
            </ul>
            <ul className="bottom-nav">
                {Object.keys(userdata).length > 0 ? (
                    <li onClick={logout} style={{ cursor: 'pointer' }}>
                        {signout} Sign Out
                    </li>
                ) : (
                    <li onClick={loginwithgoogle} style={{ cursor: 'pointer' }}>
                        Log in/Sign Up
                    </li>
                )}
            </ul>
        </NavStyled>
    );
}

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 374px;
    height: 100%;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;

    .user-con {
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;

        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            background: #fcf6f9;
            border: 2px solid #FFFFFF;
            padding: .2rem;
            box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
        }

        h2 {
            color: rgba(34, 34, 96, 1);
        }

        p {
            color: rgba(34, 34, 96, .6);
        }
    }

    .menu-items {
        flex: 1;
        display: flex;
        flex-direction: column;

        li {
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: .6rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all .4s ease-in-out;
            color: rgba(34, 34, 96, .6);
            padding-left: 1rem;
            position: relative;

            i {
                color: rgba(34, 34, 96, 0.6);
                font-size: 1.4rem;
                transition: all .4s ease-in-out;
            }
        }
    }

    .active {
        color: rgba(34, 34, 96, 1) !important;

        i {
            color: rgba(34, 34, 96, 1) !important;
        }

        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: #222260;
            border-radius: 0 10px 10px 0;
        }
    }

    .bottom-nav {
        li {
            display: flex;
            align-items: center;
            cursor: pointer;
            color: rgba(34, 34, 96, .6);
            margin-bottom: 1rem;

            &:hover {
                color: rgba(34, 34, 96, 1);
            }
        }
    }
`;

export default Navigation;