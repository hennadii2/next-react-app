import React, { Fragment } from 'react';
import Link from 'next/link';

const LogoImage = ({ logo }) => {
    return (
        <Fragment>
            <Link href={'/'} >
                <a href={'#'}>
                    <img src={`/assets/images/icon/${logo?logo:'logo.png'}`} alt="Logo" className="img-fluid" />
                </a>
            </Link>
        </Fragment>
    )
}

export default LogoImage;