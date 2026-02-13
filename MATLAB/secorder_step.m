clear;
clc;
close all;

% Parameters
om0 = 5;    % Natural frequency (rad/s) 
zeta = 0.5; % Damping ratio 
ts = 4/(zeta*om0);
% Change in zeta
change = [0.5 1 2];
color = ['r' 'g' 'b']
% Transfer function
hold on;
for i = 1:3
    zeta_temp = zeta*change(i);
    om0_temp = 4/(zeta_temp*ts);
    G = tf(om0_temp^2, [1, 2*zeta_temp*om0_temp, om0_temp^2]);
    % Step response for 5 seconds
    [y, t] = step(G, 5); 
    % Plot the step 
    figure(1);
    plot(t, y, color(i))
    xlabel('Time [s]')
    ylabel('Response')
end
legend(num2str(change))
hold off;
