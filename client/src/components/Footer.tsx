import { BikeIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { footerData } from "../assets/assets"

const linkClass = "text-sm text-white/70 hover:text-white transition-colors"

const Footer = () => {
  return (
    <footer className="bg-app-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-6">
        {/* top */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <BikeIcon className="size-6 text-white" />
              <span className="text-lg font-semibold">
                {footerData.brand.name}
              </span>
            </Link>

            <p className="text-sm text-white/70 mb-5 max-w-sm">
              {footerData.brand.description}
            </p>

            {/* socials */}
            <div className="flex gap-3">
              {footerData.brand.socials.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Social link"
                  className="size-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* dynamic sections */}
          {footerData.sections.map((section, index) => (
            <div key={index} className="flex flex-col gap-3">
              <h3 className="font-semibold">{section.title}</h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.to ? (
                      <Link to={link.to} className={linkClass}>
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className={linkClass}>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* contact */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <h3 className="font-semibold">Contact Us</h3>
            <ul className="flex flex-col gap-3">
              {footerData.contact.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <item.icon className="size-4 mt-0.5 shrink-0 text-white/80" />
                  <span className="text-sm text-white/70 break-words min-w-0">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* bottom */}
        <div className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-white/60 text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} {footerData.bottom.copyright}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {footerData.bottom.links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer