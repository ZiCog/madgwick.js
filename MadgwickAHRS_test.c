#include <stdio.h>

#include "MadgwickAHRS.h"

int main (int argc, char* argv[])
{

    float gx = 0.0;
    float gy = 0.0;
    float gz = 0.0;
    float ax = 1.0;
    float ay = 1.0;
    float az = 1.0;
    float mx = 0.0;
    float my = 0.0;
    float mz = 0.0;

    int i;

    printf("Size of float is %d\n", sizeof(float));

    printf ("%f, %f, %f, %f\n", q0, q1, q2, q3);

    for (i = 0; i < 100; i += 1) {
        MadgwickAHRSupdate(gx, gy, gz, ax, ay, az, mx, my, mz);
        printf ("%f, %f, %f, %f\n", q0, q1, q2, q3);
    }

    return(0);
}