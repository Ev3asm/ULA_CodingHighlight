% closes all figures that are currently open
close all;
% clears the command window
clc;
% clears all data from the workspace
clear;

% declares needed symbol variables of the system
syms m1 m2 L1 L2 theta1(t) theta2(t) g T1 T2

% Define T as the found kinetic energy of the system
T = (m1*L1^2*diff(theta1, t)^2)/6 + (m2*L1^2*diff(theta1, t)^2)/2 + ...
    (m2*L1*L2*diff(theta1, t)*diff(theta2, t)*cos(theta1-theta2))/2 + (m2*L2^2*diff(theta2, t)^2)/6;

% Define V as the found potential energy of the system
V = m1*g*L1*sin(theta1)/2 + m2*g*L1*sin(theta1) + m2*g*L2*sin(theta2)/2;

% Define Lagrangian from T and V
Lagrangian = T-V;

% Using the Euler-Lagrange equation define eom1 and eom2
eom1 = simplify(diff(diff(Lagrangian, diff(theta1,t)),t)-diff(Lagrangian, theta1)) == T1 - T2
eom2 = simplify(diff(diff(Lagrangian, diff(theta2,t)),t)-diff(Lagrangian, theta2)) == T2
