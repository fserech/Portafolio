export interface Blog {
    cover_image: string;
    title: string;
    description: string;
    url: string;
    published_at: string;
    tag_list: string[];
    reading_time_minutes: number;
    public_reactions_count: number;
    comments_count: number;
}