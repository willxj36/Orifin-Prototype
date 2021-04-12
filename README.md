## Orifin Prototype
This project is intended as a prototype for a future deployed website for Orifin, LLC. Currently deployed during dev at orifin-prototype.herokuapp.com. This will change later.

# Current Usage vs. Final Usage
Project is somewhat sandbox right now, any registered user can make a reservation a month out, and no payment required. This will be limited by membership types later.

Employee side of the site will be coded into the site to begin with, that will happen after client side of the site is entirely done as the owners want the site fully live before the business actually opens, but I'll be able to do any employee-side stuff manually still until the doors actually open. I will likely migrate the employee side to an Electron app separate from the site in the future for extra security and better UX altogether.

Styling is a very basic idea, may be tuned later on to owners' needs. Functionality is top priority for now.

# Reservation System
Reservation code is very heavy to catch any and all edge cases possible while also streamlining processes wherever it can. Given early estimates from the owners, the facility will likely be able to have 408 reservations per day, possibly more. Therefore, availability is split into its own heavily simplified table, and reservation details are never loaded more than one day or one user at a time.

# Testing
Feel free to make your own account and check out the features of the site. If you break it, please tell me as many details of how and where as possible! Feedback is more than welcome as well. This is my first project after coding school that will actually be a fully usable and functional site made from scratch, so don't hesitate to throw criticisms my way.