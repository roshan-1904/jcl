import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-[#1f2a38] text-[#d1d5db] pt-[60px] font-sans">
      <div class="max-w-7xl mx-auto px-6 pb-10">
        <!-- Top Section: 4 Columns Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px]">
          
          <!-- COLUMN 1: Brand & About -->
          <div class="flex flex-col space-y-6 text-center md:text-left">
            <div class="flex justify-center md:justify-start">
              <img src="https://www.jcislmmidtown.com/assets/images/logo-default.png" 
                   alt="JCI Logo" 
                   class="h-16 w-auto brightness-0 invert object-contain">
            </div>
            <p class="text-sm leading-relaxed">
              JCI Salem Mid Town – Empowering Leaders, Inspiring Change. 
              <span class="text-[#f4b400] font-semibold italic">Join us</span> to make a difference.
            </p>
            <div class="flex justify-center md:justify-start space-x-4 pt-2">
              <a href="#" class="hover:text-[#f4b400] transition-colors duration-300"><i class="fab fa-facebook-f text-lg"></i></a>
              <a href="#" class="hover:text-[#f4b400] transition-colors duration-300"><i class="fab fa-instagram text-lg"></i></a>
              <a href="#" class="hover:text-[#f4b400] transition-colors duration-300"><i class="fab fa-twitter text-lg"></i></a>
              <a href="#" class="hover:text-[#f4b400] transition-colors duration-300"><i class="fab fa-linkedin-in text-lg"></i></a>
            </div>
          </div>

          <!-- COLUMN 2: Information -->
          <div class="text-center md:text-left">
            <h4 class="text-white font-bold text-lg mb-8 relative inline-block">
              Information
              <span class="absolute -bottom-2 left-0 w-10 h-0.5 bg-[#f4b400]"></span>
            </h4>
            <ul class="space-y-4">
              <li>
                <a routerLink="/" class="footer-link">Home</a>
              </li>
              <li>
                <a routerLink="/about" class="footer-link">About Us</a>
              </li>
            </ul>
          </div>

          <!-- COLUMN 3: Essentials -->
          <div class="text-center md:text-left">
            <h4 class="text-white font-bold text-lg mb-8 relative inline-block">
              Essentials
              <span class="absolute -bottom-2 left-0 w-10 h-0.5 bg-[#f4b400]"></span>
            </h4>
            <ul class="space-y-4">
              <li>
                <a href="#" class="footer-link">Lo Business</a>
              </li>
              <li>
                <a routerLink="/contact" class="footer-link">Contact Us</a>
              </li>
            </ul>
          </div>

          <!-- COLUMN 4: Get In Touch -->
          <div class="text-center md:text-left">
            <h4 class="text-white font-bold text-lg mb-8 relative inline-block">
              Get In Touch
              <span class="absolute -bottom-2 left-0 w-10 h-0.5 bg-[#f4b400]"></span>
            </h4>
            <p class="text-white text-sm font-semibold mb-6 uppercase tracking-wider">Location and contact</p>
            <ul class="space-y-5">
              <li class="flex items-start justify-center md:justify-start space-x-3 group">
                <i class="fas fa-map-marker-alt text-[#f4b400] mt-1 group-hover:scale-110 transition-transform"></i>
                <span class="text-sm">Salem Tamilnadu, India</span>
              </li>
              <li class="flex items-center justify-center md:justify-start space-x-3 group">
                <i class="fas fa-phone-alt text-[#f4b400] group-hover:scale-110 transition-transform"></i>
                <a href="tel:+919943055055" class="text-sm footer-link">+91 9943055055</a>
              </li>
              <li class="flex items-center justify-center md:justify-start space-x-3 group">
                <i class="fas fa-envelope text-[#f4b400] group-hover:scale-110 transition-transform"></i>
                <a href="mailto:info@jcisalmmidtown.com" class="text-sm footer-link">info&#64;jcisalmmidtown.com</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="bg-[#17202a] py-6 border-t border-white/5">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0 tracking-wide">
          <p class="text-gray-400">
            &copy; 2024 JCI Salem Mid-Town. All Rights Reserved.
          </p>
          <p class="text-gray-400">
            Powered by <a href="#" class="text-[#f4b400] font-bold hover:underline transition-all">Techforge</a>
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-link {
      @apply transition-all duration-300 hover:text-[#f4b400] hover:pl-2 relative;
    }
    .footer-link::before {
      content: '';
      @apply absolute bottom-0 left-0 w-0 h-0.5 bg-[#f4b400] transition-all duration-300;
    }
    .footer-link:hover::before {
      @apply w-full;
    }
    :host {
      display: block;
    }
  `]
})
export class FooterComponent {}
