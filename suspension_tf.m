%% Documentation   
% Study of a quarter-vehicle two-mass suspension model using transfer functions

%% Initialization
clear all; close all; clc; % addpath()

%% Parameters
m1 = 300   ; % Sprung mass [kg]
c1 = 1000  ; % Suspension damping [N.s/m] (slight increase for better control)
k1 = 16000 ; % Suspension stiffness [N/m]
k2 = 180000; % Tire stiffness [N/m]
m2 = 50    ; % Unsprung mass [kg]


%% Q5.1 - System - Transfer functions
den = [ m1* m2 , (m1*c1 + m2*c1), + (m1*k1 + m1*k2 + m2*k1) , c1*k2,  k1*k2 ];
numX1 = [k2*c1, k2*k1] ;
numX2 = [k2*m1, k2*c1, k2*k1];
sysX1 = tf(numX1, den);
sysX2 = tf(numX2, den);
% TODO - transfer function for force
numF = [m1*k2*c1, m1*k2*k1, 0, 0];
sysF = tf(numF, den)

%% Q5.2 - Poles, frequencies, damping ratio
% TODO compute poles, frequencies and damping ratios
p = pole(sysF)
tau = -1 / real(p)
zero(sysF)
omega0 = abs(p)
f0 = omega0/(2*pi)

damp(sysF)

%% Q5.3 Step, impulse responses for x1
t = linspace(0, 5, 300);
% TODO compute characteristic responses
[y1, t1] = step(sysF);
[y2, t2] = impulse(sysF);

figure(53)
hold all
% TODO plot responses here
plot(t1, y1, t2, y2);

xlabel('Time [s]')
ylabel('Displacement amplitude [m]')
title('Characteristic responses')
legend()


%% Q5.4 - Simulation for a bump input
V = 10 ; % vehicle speed [m/s]
L = 0.5; % bump length [m]
H = 0.2; % bump height [m]
M = readmatrix('bump.csv');
x_rel = M(:,1); % relative distance x/L, L=bump length [-]
u_rel = M(:,2); % relative bump height, u/H [-]
t = x_rel/V*L;  % Time values for the input [s]
u = u_rel*H;    % Time series of input, u(t), bump [m]

figure()
plot(t, u);


% TODO simulate systems here using lsim

[x1, t1] = lsim(sysX1, u, t);
[x2, t2] = lsim(sysX2, u, t);
[f1, t3] = lsim(sysF, u, t);



figure(54)
subplot(1,2,1)
hold all
plot(t1, x1, t2, x2, t3, f1);
plot(t, u , 'DisplayName', 'Input')
% TODO plot amplitudes here
xlim([0, 1.0])
grid on
xlabel('Time [s]')
ylabel('Displacement amplitude [m]')
legend()

subplot(1,2,2)
hold all
% TODO plot force here
xlim([0, 1.0])
grid on
xlabel('Time [s]')
ylabel('Force on chassis [N]')
sgtitle('Time response to a bump near Mullins center')


%% Q5.5 - Frequency response
Omega = linspace(0, 500, 2500);
figure(55); hold all;
% TODO plot Bode diagram
bode(sysX1);
bode(sysX2);
