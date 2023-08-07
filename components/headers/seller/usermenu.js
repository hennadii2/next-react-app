import React, { Fragment, useContext } from "react";
import { useRouter } from "next/router";
import man from "../../../public/assets/images/user.png";
import { AuthContext } from "../../../helpers/auth/AuthContext";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const UserMenu = ({role}) => {
	const router = useRouter();
	const authContext = useContext(AuthContext);
	const user  = authContext.user
	const onAuth = authContext.onAuth

	const onLogoutClicked = async () => {
		// removing session variable
		const apiResponse = await fetch("/api/logout", {
		  	method: "POST"
		});
	
		if (apiResponse.ok) {
			if (router.asPath === "/") {
				localStorage.removeItem("isAuthenticated");
				localStorage.removeItem("user");
				onAuth({}, false);
				router.push("/")
			} else {
				router.push({
					pathname: '/',
					query: { auth: "logout" },
				})
			}
		}
	}

	return (
		<Fragment>
			<li className="onhover-dropdown">
				<div className="media align-items-center">
					<img
						className="align-self-center pull-right img-50 rounded-circle blur-up lazyloaded"
						src={user.profilepictureISfile ? (contentsUrl + user.profilepictureISfile) : man}
						alt="header-user"
					/>
				</div>
				<ul className="profile-dropdown onhover-show-div p-20 profile-dropdown-hover">
					<li>
						<a href={ role == "seller" ? "/seller/account" : "/buyer/account" }>
							<i data-feather="user"></i>My Account
						</a>
					</li>					
					<li>
						<a href='#' onClick={onLogoutClicked}>
							<i data-feather="log-out"></i>Logout
						</a>
					</li>
				</ul>
			</li>
		</Fragment>
	);
};

export default UserMenu;
