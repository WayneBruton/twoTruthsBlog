create database twotruths;

use twotruths;

create table members (
    id int auto_increment primary key,
    name varchar(160) not null,
    email varchar(160) not null unique,
    avatar varchar(160),
    website varchar(160),
    password varchar(160) not null,
    createdAt TIMESTAMP DEFAULT NOW(),
    paidMember boolean not null default false 
);

alter table members add column aboutMember text;
alter table members add column showEmail boolean default false;
alter table members add column expires TIMESTAMP DEFAULT NOW();
alter table members alter showEmail set default false;

alter table members add column tags text;

create table tags (
    id int auto_increment primary key,
    tag varchar(160) not null unique,
    timesUsed INT not null default 0,
    createdAt TIMESTAMP DEFAULT NOW()
);

create table articles (
    id int auto_increment primary key,
    member Int not null,
    member_name varchar(160) not null,
    coverImgURL varchar(160) not null,
    coverImgID varchar(160) not null,
    title varchar(160) not null,
    credit varchar(160) not null,
    content mediumText not null,
    tags varchar(160) not null,
    claps int not null default 0,
    wordCount int not null,
    readTime varchar(100) not null,
    createdAt TIMESTAMP DEFAULT NOW(),
    isDraft boolean default true,
    FOREIGN KEY (member) REFERENCES members(id) 
);

alter table articles add articleImages text;

create table articleLikes (
    id int auto_increment unique,
    member Int not null,
    article Int not null,
    claps Int not null default 0,
    createdAt TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id, member, article),
    FOREIGN KEY (member) REFERENCES members(id), 
    FOREIGN KEY (article) REFERENCES articles(id) 
);

create table bookmark (
    id int auto_increment,
    member int not null,
    article int not null,
    createdAt TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id, member, article),
    FOREIGN KEY (member) REFERENCES members(id),
    FOREIGN KEY (article) REFERENCES articles(id)
);

create table follows (
    id int auto_increment,
    member int not null,
    member_following int not null,
    createdAt TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id, member, member_following),
    FOREIGN KEY (member) REFERENCES members(id),
    FOREIGN KEY (member_following) REFERENCES members(id)
);

create table comments (
    id int auto_increment primary key,
    commentBy Int not null,
    articleNumber int not null,
    comment text not null,
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (commentBy) REFERENCES members(id),
    FOREIGN KEY (articleNumber) REFERENCES articles(id)
);

create table replies (
    id int auto_increment primary key,
    commentBy Int not null,
    articleNumber int not null,
    replyTo int not null, 
    comment text not null,
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (commentBy) REFERENCES members(id),
    FOREIGN KEY (articleNumber) REFERENCES articles(id),
    FOREIGN KEY (replyTo) REFERENCES comments(id)
);

insert into tags (tag) values (
('Startup'),
('Blockchain'),
('Life'),
('Life Lessons'),
('Politics'),
('SEO'),
('Travel'),
('Entrepreneurship'),
('Poetry'),
('Education'),
('Health'),
('Love'),
('Design'),
('Technology'),
('Cryptocurrency'),
('Writing'),
('Marketing'),
('Self Improvement'),
('Business'),
('Music'),
('Social Media'),
('Relationships'),
('Productivity'),
('Tech'),
('Sports'),
('Food'),
('Art'),
('Short Story'),
('News'),
('Programming'),
('Fiction'),
('Mental Health'),
('Javascript'),
('UX'),
('Web Development'),
('PPC marketing'),
('Inspiration'),
('Artificial Intelligence'),
('Culture'),
('Christianity'),
('Books'),
('Creativity'),
('Real Estate'),
('Fashion'),
('Digital Marketing'),
('Family'),
('Software Development'),
('Gaming'),
('Investing'),
('Motivation'),
('Science'
);