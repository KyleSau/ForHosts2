import React from 'react';

const SubscribeForm: React.FC = () => {
    return (
        <div className="mx-auto w-full">
            <div className="flex items-center justify-center">
                <form
                    action="https://forhosts.us10.list-manage.com/subscribe/post?u=ee5ada4b2cd5ccda4f6903c6f&amp;id=b072f8f37a&amp;f_id=0007e0e5f0"
                    method="post"
                    id="mc-embedded-subscribe-form"
                    name="mc-embedded-subscribe-form"
                    className="py-8 lg:py-16 mx-auto max-w-screen-xl px-4"
                    target="_blank"
                >
                    <h2 className="text-2xl font-bold mb-4">Receive News, Updates, and Land Information</h2>
                    <div className="mb-4">
                        <label htmlFor="mce-EMAIL" className="block text-gray-600">Email Address <span className="text-red-500">*</span></label>
                        <input type="email" name="EMAIL" id="mce-EMAIL" className="border rounded-md px-3 py-2 w-full" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="mce-FNAME" className="block text-gray-600">First Name</label>
                        <input type="text" name="FNAME" id="mce-FNAME" className="border rounded-md px-3 py-2 w-full" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="mce-LNAME" className="block text-gray-600">Last Name</label>
                        <input type="text" name="LNAME" id="mce-LNAME" className="border rounded-md px-3 py-2 w-full" />
                    </div>
                    <div className="hidden">
                        <input type="hidden" name="tags" value="14171768" />
                    </div>
                    <div id="mce-responses" className="clear foot">
                        <div id="mce-error-response" className="response" style={{ display: 'none' }}></div>
                        <div id="mce-success-response" className="response" style={{ display: 'none' }}></div>
                    </div>
                    <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
                        <input type="text" name="b_ee5ada4b2cd5ccda4f6903c6f_b072f8f37a" tabIndex={-1} value="" />
                    </div>
                    <div className="mb-4">
                        <input type="submit" name="subscribe" id="mc-embedded-subscribe" className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" value="Subscribe" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubscribeForm;
