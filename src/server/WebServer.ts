import assert from 'assert';
import express, { Application, json, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import http from 'http';
import cors from 'cors';
import session from 'express-session';
import { User } from './User';
import HttpStatus from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import connectMongo from 'connect-mongodb-session';
import { MongooseError } from "mongoose";

export class WebServer {
    private readonly app: Application;
    public server: http.Server | undefined;

    public constructor(private readonly port: number) {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(session({
            secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
        }));
          
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        passport.serializeUser(function(user, done) {
            done(null, user);
        });

        passport.deserializeUser((user: any, done) => {
            done(null, user);
        });

        const tokenToProfile = (accessToken: any, refreshToken: any, profile: any, cb: any) => {
            console.log(accessToken);
            return cb(undefined, {email: "adhami@mit.edu", name: "Khaleel Al-Adhami"});
        };

        passport.use(new OAuth2Strategy({
            state: true,
            authorizationURL: 'https://github.com/login/oauth/authorize',
            tokenURL: 'https://github.com/login/oauth/access_token',
            clientID: "1",
            clientSecret: "barish",
            callbackURL: "http://localhost:8888/callback",
            passReqToCallback: true
        }, tokenToProfile));

        this.app.get('/login', passport.authenticate('oauth2', {
            session: true,
            successReturnToOrRedirect: '/'
        }));
          
        this.app.get('/callback', (req, res) => {
            passport.authenticate('oauth2', { failureRedirect: '/login-failure' });
        }, (req, res) => {
            res.redirect("/login-success");
        });

        this.app.get("/", (req, res) => {
            res.send('<h1>Home</h1><p>Please <a href="/register">register or login through eyedeer</a></p>');
        });

        const isAuth = (req: Request, res: Response, next: NextFunction) => {
            if (req.isAuthenticated()) {
                next();
            } else {
                res.status(401).json({ msg: 'You are not authorized to view this resource' });
            }
        };

        this.app.get('/protected-route', isAuth, (req, res) => {
            res.send('You made it to the route.');
        });

        this.app.get('/login-success', (req, res) => {
            res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
        });

        this.app.get('/login-failure', (req, res) => {
            res.send('You entered the wrong password.');
        });
    }


    public start(): Promise<void> {
        return new Promise(resolve => {
            this.server = this.app.listen(this.port, () => {
                console.log('server now listening at', this.port);
                resolve();
            });
        });
    }

    public stop(): void {
        this.server?.close();
        console.log('server stopped');
    }
}