// этот файл подтянется первым в каждом тестовом раннере
import 'reflect-metadata';   // для корректной работы декораторов TypeORM
import './setupEnv';         // задаём process.env.JWT_SECRET
