create database veterinaria_db character set utf8mb4 collate utf8mb4_unicode_ci;

USE veterinaria_db;

create table citas(
    id int AUTO_INCREMENT PRIMARY KEY,
    mascota varchar(80) NOT NULL,
    cliente VARCHAR(120) NOT NULL,
    servicio VARCHAR(120) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado ENUM('solicitada', 'confirmada', 'atendida',
               'rechazada', 'cancelada') NOT NULL DEFAULT 'solicitada',
                created_at timestamp default current_timestamp,
                updated_at timestamp default current_timestamp on 
                update current_timestamp);
insert into citas
(mascota, cliente, servicio, fecha, hora, estado) 
values
('Max', 'Ana López', 'Vacunación', '2026-10-28', '09:00:00', 'solicitada'),
('Voyka', 'Irvin Chan', 'Consulta Médica', '2026-10-28', '13:00:00', 'solicitada'),
('Firulais', 'Agapito Pacheco', 'Esterilizar', '2026-10-28', '15:00:00', 'solicitada'),
('Rocky', 'María Gómez', 'Desparasitar', '2026-10-28', '12:00:00', 'solicitada');

select * from citas;