create Table person(
    id serial primary key,
    name varchar(255),
    surname varchar(255)


);

create Table post(
    id serial primary key,
    title varchar(255),
    user_id integer,
    FOREIGN KEY  (user_id) REFERENCES person(id)

);