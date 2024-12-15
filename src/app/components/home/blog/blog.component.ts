import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { BlogService } from '@core/services/blog.service';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, BlogCardComponent],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  blogs: any[] = [];
  faArrowRight = faArrowRight;

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe(
      (blogs) => {
        this.blogs = blogs;
      }
    );
  }

  trackBlog(index: number, blog: any): string {
    return blog.id;
  }
}
