import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const antimaximalismDefn = <>
    antimaximalism &nbsp; <em>adj</em> &nbsp; 
</>

export default function Antimaximalism() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div>
                            antimaximalism: <em>noun</em>.
                        </div>
                        <div>
                            <b>1.</b> The perspective that there is no "one true blockchain" that places strong emphasis on knowing a lot about a lot of networks, understanding precisely what each can do, can't do, is good at, and isn't good at, and selecting the networks used to build a project based off of this knowledge.
                        </div>
                        <div>
                            <b>2.</b> The opposite of <a href="https://media.consensys.net/why-is-there-maximalism-in-crypto-27967ce9025e)">maximalism</a>.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}