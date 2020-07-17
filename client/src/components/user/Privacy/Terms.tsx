import * as React from "react";
import { NavLink } from "react-router-dom";
import './styles.scss';
import Navbar from "../Navbar";
interface IState {

}

interface IProps {

}

class TermsAndConditions extends React.Component<IProps, IState> {

    public render(): JSX.Element {
        return (
            <>
                <Navbar />
                <div className="sp-container main-container" >
                    <div className="privacy-c">
                        <h4> Terms and Conditions</h4>
                        <h6>SECTION 1 - GENERAL</h6>
                        <p> This website is operated by Q Group Media. Throughout the site, the terms “we”, “us” and “our” refer to Q Group Media. Q Group Media offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here. By visiting our site and/or register and/or login into our site, you engage in our “Service” and agree to be bound by the following terms and conditions (“Terms of Service”, “Terms”), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation.</p>
                        <h6>SECTION 2 - YOUR COMMITMENTS TO Q GROUP MEDIA AND OUR COMMUNITY</h6>
                        <h6>1. Who can use Q Group Media</h6>
                        <p>When people stand behind their opinions and actions, our community is safer and more accountable. For this reason, you must:</p>
                            <ul><li>use the same name that you use in everyday life;</li>
                                <li>provide accurate information about yourself;</li>
                                <li>create only one account (your own) and use your timeline for personal purposes; and</li>
                                <li>not share your password, give access to your Q Group Media account to others or transfer your account to anyone else (without our permission).</li>
                            </ul>
                        
                        <h6>2.What you can share and do on Q Group Media</h6>
                        <p>We want people to use Q Group Media to know the latest news and news analysis by the journalists. You therefore agree not to engage in the conduct described below (or to facilitate or support others in doing so): </p>
                        <p>1.You may not use our Services to do or share anything: </p>
                        <ul><li>That breaches these Terms, our Community Standards, and other Terms and Policies that apply to your use of Q Group Media.</li>
                            <li>That is unlawful, misleading, discriminatory or fraudulent.</li>
                            <li>That infringes or violates someone else's rights, including their intellectual property rights.</li>
                        </ul>
                        <p>2.You may not upload viruses or malicious code, or do anything that could disable, overburden or impair the proper working or appearance of our Products or Services.</p>
                        <p>3.You may not access or collect data from our Products using automated means (without our prior permission) or attempt to access data that you do not have permission to access. </p>
                        <p>We can remove or restrict access to content that is in violation of these provisions.</p>
                        <p>To help support our community, we encourage you to report content or conduct that you believe violates your rights (including intellectual property rights) or our terms and policies.</p>
                        <h6>SECTION 3 -THE PERMISSIONS YOU GIVE US</h6>
We need certain permissions from you to provide our services:
<p>1.<u>Permission to use content that you create and share:</u> Some content that you share or upload, such as photos or videos, may be protected by intellectual property laws.</p>
                        <p>You own the intellectual property rights (things such as copyright or trademarks) in any such content that you create and share on Q Group Media. </p>
                        <p>However, to provide our services, we need you to give us some legal permissions (known as a ‘licence') to use this content. This is solely for the purposes of providing and improving our Products and services as described in this article.</p>
                        <p>Specifically, when you share, post or upload content that is covered by intellectual property rights on or in connection with our Products, you grant us a non-exclusive, transferable, sub-licensable, royalty-free and worldwide licence to host, use, distribute, modify, run, copy, publicly perform or display, translate and create derivative works of your content (consistent with your privacy and application settings). This means, for example, that if you share a photo on Q Group Media, you give us permission to store, copy and share it with others (again, consistent with your settings) such as service providers that support our service or other Q Group Media Products you use.</p>
                        <p>2. Permission to use your name, profile picture and information on the news feed.</p>
                        <p>3.<u>Permission to update software that you use or download:</u> If you download or use our software, you give us permission to download and install updates to the software where available.</p>
                        <h6>SECTION 4- LIMITS ON USING OUR INTELLECTUAL PROPERTY</h6>
                        <p>If you use content covered by intellectual property rights that we have and make available in our Products (for example, images, designs, videos or sounds that we provide, which you add to content that you create or share on Q Group Media), we retain all rights to that content (but not yours). You can only use our copyrights or trademarks (or any similar marks) as expressly permitted by our Brand Usage Guidelines or with our prior written permission. You must obtain our written permission (or permission under an open source licence) to modify, create derivative works of, decompile or otherwise attempt to extract source code from us.</p>
                        <h6>SECTION 5 - GENERAL CONDITIONS</h6>
                        <p>Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.</p>
                        <p>  We reserve the right to refuse service to anyone for any reason at any time.
                        You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.
                        You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.
                        The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.</p>
                        <h6>SECTION 6 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION</h6>

                        <p>  We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.
                        This site may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.
</p>
                        <h6>SECTION 7 - MODIFICATIONS TO THE SERVICE</h6>

                        <p>  Modifications to services are subject to change without notice.
                        We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
                        We shall not be liable to you or to any third-party for any modification, suspension or discontinuance of the Service.</p>
                        <h6>SECTION 8 - OPTIONAL TOOLS</h6>
                        <p>  We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.
                        You acknowledge and agree that we provide access to such tools ”as is” and “as available” without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.
                        Any use by you of optional tools offered through the site is entirely at your own risk and discretion and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s).
                        We may also, in the future, offer new services and/or features through the website (including, the release of new tools and resources). Such new features and/or services shall also be subject to these Terms of Service.</p>
                        <h6>SECTION 9 - THIRD-PARTY LINKS</h6>
                        <p>  Certain content, products and services available via our Service may include materials from third-parties.
                        Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or services of third-parties.
                        We are not liable for any harm or damages related to the purchase or use of goods, services, resources, content, or any other transactions made in connection with any third-party websites. Please review carefully the third-party's policies and practices and make sure you understand them before you engage in any transaction. Complaints, claims, concerns, or questions regarding third-party products should be directed to the third-party.</p>
                        <h6>SECTION 10- USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS</h6>
                        <p>  If, at our request, you send certain specific submissions (for example contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise (collectively, 'comments'), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us. We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments.
                        We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party’s intellectual property or these Terms of Service.
                        You agree that your comments will not violate any right of any third-party, including copyright, trademark, privacy, personality or other personal or proprietary right. You further agree that your comments will not contain libelous or otherwise unlawful, abusive or obscene material, or contain any computer virus or other malware that could in any way affect the operation of the Service or any related website. You may not use a false e-mail address, pretend to be someone other than yourself, or otherwise mislead us or third-parties as to the origin of any comments. You are solely responsible for any comments you make and their accuracy. We take no responsibility and assume no liability for any comments posted by you or any third-party.</p>
                        <h6>SECTION 11 - PERSONAL INFORMATION</h6>
                        <p>  Your submission of personal information through the site is governed by our Privacy Policy. To view our Privacy Policy
                        <NavLink to='/privacy'> Click here </NavLink>
                        </p>
                        <h6>SECTION 12- PROHIBITED USES</h6>
                        <p>  In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content: (a) for any unlawful purpose; (b) to solicit others to perform or participate in any unlawful acts; (c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; (d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others; (e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability; (f) to submit false or misleading information; (g) to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet; (h) to collect or track the personal information of others; (i) to spam, phish, pharm, pretext, spider, crawl, or scrape; (j) for any obscene or immoral purpose; or (k) to interfere with or circumvent the security features of the Service or any related website, other websites, or the Internet. We reserve the right to terminate your use of the Service or any related website for violating any of the prohibited uses.</p>
                        <h6>SECTION 13 - TERMINATION</h6>
                        <p>We want Q Group Media to be a place where people feel welcome and safe to express themselves and share their thoughts, ideas and post news .</p>
                        <p>If we determine that you have clearly, seriously or repeatedly breached our Terms or Policies, including in particular our Community Standards, we may suspend or permanently disable access to your account. We may also suspend or disable your account if you repeatedly infringe other people's intellectual property rights or where we are required to do so for legal reasons.</p>
                        <h6>SECTION 14 - ENTIRE AGREEMENT</h6>
                        <p>  The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.
                        These Terms of Service and any policies or operating rules posted by us on this site or in respect to The Service constitutes the entire agreement and understanding between you and us and govern your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service).
                        Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.</p>
                        <h6>SECTION 15 - CHANGES TO TERMS OF SERVICE</h6>
                        <p>  You can review the most current version of the Terms of Service at any time at this page.
                        We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.</p>
                        <h6>SECTION 17 - CONTACT INFORMATION </h6>
                        <p>  Questions about the Terms of Service should be sent to us at support@Journalism.com </p>
                    </div>
                    <div className="privacy">
                <span className="title-a1">Q Group Media © 2020</span>
                <br />
                <NavLink exact to="/privacy">Privacy
                </NavLink>
               
                <NavLink exact to="/about-us">About Us
                </NavLink>
                
                <NavLink exact to="/contact-us">Contact Us
                </NavLink>
            </div>
                </div>

               
            </>
        );
    }

}

export default TermsAndConditions;