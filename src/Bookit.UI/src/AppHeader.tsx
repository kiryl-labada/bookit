import * as React from "react";
import logo from "./icons/logo.svg";
import { MainMenu, MainMenuButton, FlexSpacer, MainMenuCustomElement, DropdownMenuButton, Dropdown, MainMenuAvatar, DropdownMenuBody, DropdownMenuSplitter } from "@epam/loveship";
import css from './AppHeader.module.scss';

export const AppHeader = () => {
    return (
        <MainMenu appLogoUrl={ logo } logoLink={ { pathname: '/' } } cx={ css.header } >
            <MainMenuButton caption='Booking' link={ { pathname: '/booking' } } priority={ 1 } estimatedWidth={ 72 } />
            <MainMenuButton caption='Catalog' link={ { pathname: '/catalog' } } priority={ 1 } estimatedWidth={ 72 } />
            <FlexSpacer priority={ 100500 } />
            <MainMenuCustomElement priority={ 11 } estimatedWidth={ 84 }>
                    <Dropdown
                        renderTarget={ props => (
                            <MainMenuAvatar
                                avatarUrl="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50"
                                isDropdown
                                { ...props }
                            />
                        ) }
                        renderBody={ () => (
                            <DropdownMenuBody >
                                <DropdownMenuButton caption="Settings" />
                                <DropdownMenuSplitter />
                                <DropdownMenuButton caption="Log out" />
                            </DropdownMenuBody>
                        ) }
                        placement="bottom-end"
                    />
                </MainMenuCustomElement>
        </MainMenu>
    )
}